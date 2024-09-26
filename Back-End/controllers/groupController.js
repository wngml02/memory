// controllers/groupController.js
const bcrypt = require('bcryptjs');
const groupModel = require('../models/groupModel');

// 그룹 등록 로직
exports.createGroup = (req, res) => {
    const { name, password, imageUrl, isPublic, introduction } = req.body;

    // 필수 데이터 유효성 검증
    if (!name || !password) {
        return res.status(400).json({ message: 'Name and password are required.' });
    }

    // 비밀번호 해시 처리
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            console.error('Error during password hashing:', err); // 에러 로그 출력
            return res.status(500).json({ message: 'Password encryption failed.' });
        }

        // 비밀번호 해시 성공 시, DB에 저장하는 로직
        groupModel.createGroup({
            name,
            passwordHash: hash, // 해시된 비밀번호 저장
            imageUrl,
            isPublic,
            introduction
        }, (err, newGroup) => {
            if (err) {
                console.error('Error during group creation:', err); // 에러 로그 출력
                return res.status(500).json({ message: 'Failed to create group.' });
            }

            return res.status(201).json({
                id: newGroup.id,
                name: newGroup.name,
                imageUrl: newGroup.imageUrl,
                isPublic: newGroup.isPublic,
                likeCount: 0,
                badges: [],
                postCount: 0,
                createdAt: newGroup.createdAt,
                introduction: newGroup.introduction
            });
        });
    });
};

// 그룹 수정 로직
exports.updateGroup = (req, res) => {
    const groupId = req.params.groupId;
    const { password, name, imageUrl, isPublic, introduction } = req.body;

    // 그룹 정보 가져오기
    groupModel.getGroupById(groupId, (err, group) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to retrieve group.' });
        }

        if (!group) {
            return res.status(404).json({ message: 'Group not found.' });
        }

        // 비밀번호 검증 (해시된 비밀번호와 비교)
        bcrypt.compare(password, group.passwordHash, (err, isMatch) => {
            if (err) {
                return res.status(500).json({ message: 'Error during password comparison.' });
            }

            // 비밀번호가 일치하지 않으면 403 응답
            if (!isMatch) {
                return res.status(403).json({ message: 'Incorrect password.' });
            }

            // 비밀번호가 일치하면 그룹 정보 수정
            const updatedData = {
                name: name || group.name,
                imageUrl: imageUrl || group.imageUrl,
                isPublic: isPublic !== undefined ? isPublic : group.isPublic,
                introduction: introduction || group.introduction
            };

            // 그룹 업데이트 실행
            groupModel.updateGroup(groupId, updatedData, (err, result) => {
                if (err) {
                    return res.status(500).json({ message: 'Failed to update group.' });
                }

                return res.status(200).json({
                    message: 'Group updated successfully.',
                    groupId: groupId,
                    updatedData
                });
            });
        });
    });
};

// 삭제 로직
exports.deleteGroup = (req, res) => {
    const groupId = req.params.groupId;
    const { password } = req.body;

    // 그룹 조회
    groupModel.getGroupById(groupId, (err, group) => {
        if (err) {
            return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
        }
        if (!group) {
            return res.status(404).json({ message: '존재하지 않습니다' });
        }

        // 비밀번호 검증
        bcrypt.compare(password, group.passwordHash, (err, isMatch) => {
            if (err) {
                return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
            }
            if (!isMatch) {
                return res.status(403).json({ message: '비밀번호가 틀렸습니다' });
            }

            // 비밀번호가 일치 시 그룹 삭제
            groupModel.deleteGroup(groupId, (err, result) => {
                if (err) {
                    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
                }
                if (result.affectedRows === 0) {
                    return res.status(404).json({ message: '존재하지 않습니다' });
                }
                res.status(200).json({ message: '그룹 삭제 성공' });
            });
        });
    });
};

//공개그룹 조회 로직
exports.listGroups = (req, res) => {
    const { page, pageSize, sortBy, keyword, isPublic } = req.query;

    groupModel.findGroups({ page, pageSize, sortBy, keyword, isPublic }, (err, result) => {
        if (err) {
            console.error("Error during group retrieval:", err);
            return res.status(500).json({ message: 'Error retrieving groups.' });
        }
        res.json({
            currentPage: parseInt(page),
            totalPages: Math.ceil(result.total / pageSize),
            totalItemCount: result.total,
            data: result.groups
        });
    });
};

// 비공개 그룹 권한 확인
exports.verifyGroupPassword = (req, res) => {
    const groupId = req.params.groupId;
    const userInputPassword = req.body.password;

    groupModel.getGroupById(groupId, (err, group) => {
        if (err) {
            return res.status(500).json({ message: "Error retrieving group information." });
        }
        if (!group) {
            return res.status(404).json({ message: "Group not found." });
        }

        bcrypt.compare(userInputPassword, group.passwordHash, (err, isMatch) => {
            if (err) {
                return res.status(500).json({ message: "Error comparing passwords." });
            }
            if (!isMatch) {
                return res.status(403).json({ message: "Incorrect password." });
            }

            res.status(200).json({ message: "Password verified successfully." });
        });
    });
};